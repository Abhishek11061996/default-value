import { list } from '@keystone-6/core';
import { allOperations, allowAll } from '@keystone-6/core/access';
import { text, checkbox, password } from '@keystone-6/core/fields';

export const lists = {
  User: list({
    access: {
      operation: {
        ...allOperations(allowAll),
        delete: ({ session }) => session?.data.isAdmin,
      },
    },
    ui: {
      hideDelete: ({ session }) => !session?.data.isAdmin,
      listView: {
        initialColumns: ['name', 'email', 'isAdmin'],
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
      password: password({
        access: {
          update: ({ session, item }) =>
            session && (session.data.isAdmin || session.itemId === item.id),
        },
        ui: {
          itemView: {
            fieldMode: ({ session, item }) =>
              session && (session.data.isAdmin || session.itemId === item.id) ? 'edit' : 'hidden',
          },
          listView: {
            fieldMode: ({ session }) => (session?.item?.isAdmin ? 'read' : 'hidden'),
          },
        },
      }),

      isAdmin: checkbox({
        access: {
          create: ({ session }) => session?.data.isAdmin,
          update: ({ session }) => session?.data.isAdmin,
        },
        ui: {
          createView: {
            fieldMode: ({ session }) => (session?.data.isAdmin ? 'edit' : 'hidden'),
          },
          itemView: {
            fieldMode: ({ session }) => (session?.data.isAdmin ? 'edit' : 'read'),
          },
        },
      }),
     
    },
  }),
};
