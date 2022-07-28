import {
  createServer,
  Factory,
  Model,
  Response,
  ActiveModelSerializer,
  hasMany,
  belongsTo,
  trait,
  RelationshipOptions,
} from "miragejs";
import { faker } from "@faker-js/faker";

// type User = {
//   name: string;
//   responsible: string;
//   email: string;
//   created_at: string;
//   classe: any;
// };

// type Classes = {
//   // id: number;
//   name: string;
//   user: any;
// };

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    models: {
      classe: Model.extend({
        user: hasMany(),
      }),
      user: Model.extend({
        classe: belongsTo(),
      }),
    },

    factories: {
      classe: Factory.extend({
        // id(i: number) {
        //   return i + 1
        // },
        name(i) {
          return `Turma ${i + 1}`;
        },
      }),
      user: Factory.extend({
        name() {
          return faker.name.findName();
        },
        responsible() {
          return faker.name.findName();
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server) {
      // debugger
      server.createList("classe", 5);
      server.createList("user", 30);

      let classesList = server.create("classe");
      server.create("user", { classe: classesList });
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;

      this.get("/classes", (schema, request) => {
        return schema.classes.all();
      });

      this.get("/users", function (schema, request) {
        const { page = 1, per_page = 30 } = request.queryParams;

        const total = schema.all("user").length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all("user")).users.slice(
          pageStart,
          pageEnd
        );

        return new Response(200, { "x-total-count": String(total) }, { users });
      });

      this.get("/classes/:id/users", function (schema, request) {
        let classeId = request.params.id;
        let classe = schema.classes.find(classeId);

        console.log({ classe });

        return classe.user;
      });

      this.post("/users");
      this.post("/users/:id");

      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}
