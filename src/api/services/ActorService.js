import qs from "qs";

import { HttpClient } from "@/api";

export class ActorService {
  async getAll(page, query) {
    let url = `/actors?page=${page}`;

    // eslint-disable-next-line valid-typeof
    if (query && typeof query === "object") {
      const queryString = qs.stringify(query);

      url += `&${queryString}`;
      console.log("QUERY IS:", query);
      console.log("URL IS:", url);
    } else if (query && typeof query === "string") {
      url += `&${query}`;
      console.log("QUERY IS:", query);
      console.log("URL IS:", url);
    }

    return HttpClient.get(url);
  }

  async get(id) {
    return HttpClient.get(`/actors/${id}`);
  }

  async create(actor) {
    return HttpClient.post("/actors/create", actor);
  }

  async update(id, actor) {
    return HttpClient.patch(`/actors/${id}`, actor);
  }

  async delete(id) {
    return HttpClient.delete(`/actors/${id}`);
  }
}
