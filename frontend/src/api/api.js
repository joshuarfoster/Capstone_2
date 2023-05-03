import axios from "axios";

const BASE_URL = "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class YouTeachApi {
      // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${YouTeachApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Create course. */
  
  static async createCourse(data) {
    let res = await this.request(`courses`, data, "post");
    return res.course;
  }

  /** Get all courses. */

  static async getCourses() {
    let res = await this.request(`courses`);
    return res.courses;
  }

  /** Get a course with specified id. */

  static async getCourse(id) {
    let res = await this.request(`courses/${id}`);
    return res.course;
  }

  /** Update a course with specified id. */

  static async updateCourse(id, data) {
    let res = await this.request(`courses/${id}`, data, "patch");
    return res.course;
  }

  /** Delete course with specified id. */

  static async deleteCourse(id) {
    await this.request(`courses/${id}`, {}, "delete");
  }

  /** Create Unit. */

  static async createUnit(data) {
    let res = await this.request(`units`, data, "post")
    return res.unit;
  }

  /** Get a unit with specified id. */

  static async getUnit(id) {
    let res = await this.request(`units/${id}`)
    return res.unit;
  }

  /** Update a unit with specified id. */

  static async updateUnit(id, data) {
    let res = await this.request(`units/${id}`, data, "patch");
    return res.unit;
  }

  /** Delete unit with specified id. */

  static async deleteUnit(id) {
    await this.request(`units/${id}`, {}, "delete");
  }

  /** Create Lesson. */

  static async createLesson(data) {
    let res = await this.request(`lessons`, data, "post")
    return res.lesson;
  }

  /** Update a lesson with specified id. */

  static async updateLesson(id, data) {
    let res = await this.request(`lessons/${id}`, data, "patch");
    return res.lesson;
  }

  /** Delete lesson with specified id. */

  static async deleteLesson(id) {
    await this.request(`lessons/${id}`, {}, "delete");
  }

  /** Add course to the courses a user is taking. */

  static async addCourse(id) {
    let res = await this.request(`userslessons/${id}`, {}, "post");
    return res.courseId;
  }

  /** Remove course from the courses a user is taking. */
  
  static async removeCourse(id) {
    await this.request(`userslessons/${id}`, {}, "delete")
  }

  /** Get unit data and progress data for unit in a course the user is taking. */
  
  static async getUnitData(id) {
    let res = await this.request(`userslessons/unitdata/${id}`);
    return res;
  }

  /** Update a lesson progress with specif id */

  static async updateLessonProgress(id, data) {
    let res = await this.request(`userslessons/lessondata/${id}`, data, "patch");
    return res.userLesson;
  }

  /** Get a user with specified username. */

  static async getUser(username) {
    let res = await this.request(`users/${username}`)
    return res.user;
  }

  /** Delete user with specified username. */

  static async deleteUser(username) {
    await this.request(`users/${username}`, {}, "delete");
  }

  /** Get saved courses for user with specified username. */

  static async getUserSavedCourses(username) {
    let res = await this.request(`users/${username}/savedcourses`)
    return res.courses;
  }

  /** Get created courses for user with specified username. */

  static async getUserCreatedCourses(username) {
    let res = await this.request(`users/${username}/createdcourses`)
    return res.courses;
  }
}

export default YouTeachApi;
