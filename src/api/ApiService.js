import {
  ActorService,
  MovieService
} from './services';

export class ApiService {
  /**
   * Creates an instance of the ApiService class if it has not already been created, and returns it
   *
   * @returns {ApiService}
   */
  static getInstance() {
    if (!this.apiService) {
      this.apiService = new ApiService();
    }

    return this.apiService;
  }

  actors() {
    return new ActorService();
  }

  movies() {
    return new MovieService();
  }
}
