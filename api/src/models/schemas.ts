import { UTCDate } from '@date-fns/utc';
import { createId as cuid } from '@paralleldrive/cuid2';
import { pgSchema, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const todoSchema = pgSchema('todo');

export const todoStatuses = todoSchema.enum('todo_status', [
	'active',
	'done',
	'deleted',
]);

export const todos = todoSchema.table('todos', {
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	description: text('description'),
	id: varchar('id', { length: 25 })
		.primaryKey()
		.notNull()
		.$defaultFn(() => cuid()),
	name: text('name').notNull(),
	status: todoStatuses().default('active'),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new UTCDate()),
});
