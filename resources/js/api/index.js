// @ts-check
import axios from "axios";

export function getComments() {
    return axios.get("/api/comments").then((response) => response.data);
}

export function getComment(id) {
    return axios.get(`/api/comments/${id}`);
}

export function deleteComment(id) {
    return axios.delete(`/api/comments/${id}`);
}

export function createComment(payload) {
    return axios
        .post(`/api/comments/`, payload)
        .then((response) => response.data);
}

// export function editComment(id, payload) {
//     return axios.patch(`/api/comments/${id}`, payload);
// }
