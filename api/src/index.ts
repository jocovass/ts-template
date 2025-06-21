import cors from 'cors';
import { count, desc, eq, ne } from 'drizzle-orm';
import express from 'express';
import { z } from 'zod';

import { db } from './models/database';
import { todos } from './models/schemas';
import { type ErrorResponse } from './utils/api/types';
import { init } from './utils/initEnv';

init();

const app = express();

app.disable('x-powered-by');

app.use(cors());

app.use(
	express.json({
		limit: '10mb',
	}),
);

const CreatTodoSchema = z.object({
	description: z.string().optional(),
	name: z.string(),
});

const UpdateTodoSchema = z.object({
	status: z.enum(['active', 'done', 'deleted']),
});

const PaginationSchema = z
	.object({
		pageNumber: z.number().min(1).optional().default(1),
		pageSize: z.number().min(5).optional().default(5),
	})
	.transform(data => ({
		limit: data.pageSize,
		number: data.pageNumber,
		offset: (data.pageNumber - 1) * data.pageSize,
	}));

function formatApiError(error: z.ZodError) {
	const fieldErrors: ErrorResponse['error']['fields'] = [];
	const errorMap: Record<string, string[]> = {};
	error.issues.forEach(value => {
		if (value.code === 'unrecognized_keys') return;
		let path: string;
		let message = value.message;
		if (Array.isArray(value.path)) {
			path = value.path[0]?.toString();
			if (value.path.length >= 2) {
				message = `${message} (at index value.path[i])`;
			}
		} else {
			path = value.path;
		}
		errorMap[path] ??= [];
		errorMap[path].push(message);
	});

	Object.entries(errorMap).forEach(([key, value]) => {
		fieldErrors.push({ error: value, field: key });
	});
	return fieldErrors;
}

// Middleware to get the pagination info or set default values
app.use((req, res, next) => {
	const result = PaginationSchema.safeParse(req.query);
	if (!result.success) {
		res.status(400).json({
			error: { message: 'Invalid query string' },
			status: 'error',
		});
		return;
	}
	res.locals.page = result.data;
	next();
});

function getPaginationMeta({
	current_page,
	limit,
	total,
}: {
	current_page: number;
	limit: number;
	total: number;
}) {
	const total_pages = Math.ceil(total / limit);
	return {
		current_page,
		next_page: total_pages > current_page ? current_page + 1 : null,
		per_page: limit,
		prev_page: current_page === 1 ? null : current_page - 1,
		total_count: total,
		total_pages,
	};
}

app.get('/todos', async (req, res) => {
	const data = await db.query.todos.findMany({
		limit: res.locals.page.limit,
		offset: res.locals.page.offset,
		orderBy: [desc(todos.createdAt)],
		where: ne(todos.status, 'deleted'),
	});
	const total = await db
		.select({ count: count() })
		.from(todos)
		.where(ne(todos.status, 'deleted'));
	res.status(200).json({
		data,
		meta: getPaginationMeta({
			current_page: res.locals.page.number,
			limit: res.locals.page.limit,
			total: total[0].count,
		}),
		status: 'success',
	});
});

app.post('/todos', async (req, res) => {
	const result = CreatTodoSchema.safeParse(req.body);
	if (!result.success) {
		res.status(400).json({
			error: {
				fields: formatApiError(result.error),
				message: 'Bad request',
			},
			status: 'error',
		});
		return;
	}
	const todo = await db.insert(todos).values(result.data).returning();
	res.status(200).json({
		data: todo[0],
		status: 'success',
	});
});

app.patch('/todos/:id', async (req, res) => {
	const result = UpdateTodoSchema.safeParse(req.body);
	if (!result.success) {
		res.status(400).json({
			error: {
				fields: formatApiError(result.error),
				message: 'Bad request',
			},
			status: 'error',
		});
		return;
	}

	const todo = await db
		.update(todos)
		.set(result.data)
		.where(eq(todos.id, req.params.id))
		.returning();

	res.status(200).json({
		data: todo[0],
		status: 'success',
	});
});

app.delete('/todos/:id', async (req, res) => {
	await db
		.update(todos)
		.set({ status: 'deleted' })
		.where(eq(todos.id, req.params.id));

	res.status(201).json();
});

app.use((req, res) => {
	res.status(404).json({
		error: {
			message: `Path ${req.path} not found or unsuported method ${req.method}`,
		},
		status: 'error',
	});
});

app.listen(8000);
