import Vuex from "vuex";
import Vue from "vue";
import { getComments, createComment, deleteComment } from "../api";
// inject store in all vue components
Vue.use(Vuex);

const store = new Vuex.Store({
    state() {
        return {
            isLoading: false,
            comments: [],
            addCommentPending: false,
        };
    },
    mutations: {
        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },
        SET_COMMENTS(state, comments) {
            state.comments = comments;
        },
        ADD_COMMENT(state, { comment, optimisticId }) {
            if (optimisticId) {
                state.comments = state.comments.map((item) => {
                    if (item.id === optimisticId) {
                        return comment;
                    }
                    return item;
                });
            } else {
                state.comments.push(comment);
            }
        },
        DELETE_COMMENT(state, id) {
            let i = state.comments.map((item) => item.id).indexOf(id);
            state.comments.splice(i, 1);
        },
        SET_ADD_COMMENT_PENDING(state, isPending) {
            state.addCommentPending = isPending;
        },
    },
    // Flux actions => dispatch actions
    actions: {
        setLoading({ commit }, isLoading) {
            commit("SET_LOADING", isLoading);
        },
        fetchComments(context, successCallback) {
            context.commit("SET_LOADING", true);
            getComments().then((comments) => {
                context.commit("SET_COMMENTS", comments);
                context.commit("SET_LOADING", false);
                if (successCallback) {
                    successCallback();
                }
            });
        },
        addComment({ commit }, { comment, optimisticId, catchCallback }) {
            commit("SET_ADD_COMMENT_PENDING", true);
            createComment(comment)
                .then((data) => {
                    // commit("ADD_COMMENT", data);
                    commit("ADD_COMMENT", {
                        comment: data,
                        optimisticId,
                    });
                })
                .catch((error) => {
                    console.error(error);
                    if (optimisticId) {
                        commit("DELETE_COMMENT", optimisticId);
                    }
                    if (catchCallback) {
                        catchCallback(error);
                    }
                })
                .finally(() => {
                    commit("SET_ADD_COMMENT_PENDING", false);
                });
        },
        deleteComment({ commit }, id) {
            deleteComment(id).then(() => {
                commit("DELETE_COMMENT", id);
            });
        },
        addCommentOptimistic({ commit }, newComment) {
            commit("ADD_COMMENT", { comment: newComment });
        },
    },
    getters: {
        nextId(state) {
            if (state.comments.length > 0) {
                return Math.max(...state.comments.map((item) => item.id)) + 1;
            } else {
                return 1;
            }
        },
    },
});

export default store;
