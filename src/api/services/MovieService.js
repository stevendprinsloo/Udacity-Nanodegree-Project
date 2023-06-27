import qs from "qs";

import { HttpClient } from "@/api";

export class MovieService {
  async getAll(page, query) {
    let url = `/movies?page=${page}`;

    if (query && typeof query === "object" && Object.keys(query).length) {
      const queryString = qs.stringify(query);

      url += `&${queryString}`;
    } else if (query && typeof query === "string") {
      url += `&${query}`;
      console.log("MOVIE QUERY IS:", query);
      console.log("MOVIE URL IS:", url);
    }

    return HttpClient.get(url);
  }

  async get(id) {
    return HttpClient.get(`/movies/${id}`);
  }

  async create(movie) {
    return HttpClient.post("/movies/create", movie);
  }

  // async update(id, movie) {
  //   return HttpClient.put(`/movies/${id}`, movie);
  // }

  async update(id, movie) {
    return HttpClient.patch(`/movies/${id}`, movie);
  }

  async delete(id) {
    return HttpClient.delete(`/movies/${id}`);
  }
}
