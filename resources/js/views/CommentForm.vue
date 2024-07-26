<template>
    <div class="comment-container">
        <div class="comment-output">
            <h3>Комментарий</h3>
            <select v-model="sortType">
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
            </select>

            <span
                ><br />
                <button class="comment-sortId" @click="sortComments('id')">
                    Сортировать по ID
                </button>
                <br />
                <button class="comment-sortDate" @click="sortComments('date')">
                    Сортировать по дате
                </button>
            </span>
            <div v-if="isLoading" class="loading">
                <img src="/images/spinner.svg" />
            </div>
            <div
                v-else
                v-for="comment in comments.slice(
                    (page - 1) * 3,
                    (page - 1) * 3 + 3
                )"
                :key="comment.id"
                class="comment"
            >
                <div class="comment-author">
                    <strong>Id комментария:</strong> {{ comment.id }}
                </div>
                <div class="comment-author">
                    <strong>Автор комментария:</strong> {{ comment.author }}
                </div>
                <div class="comment-date">
                    <strong>Дата комментария:</strong> {{ comment.date }}
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <button @click="deleteCommentLocal(comment.id)">Удалить</button>
            </div>
            <div class="page">
                <span class="page" v-for="p in pages" :key="p">
                    <button
                        @click="changePage(p)"
                        :class="{ active: p === page }"
                    >
                        {{ p }}
                    </button>
                </span>
            </div>
        </div>
        <form @submit.prevent="submitComment" class="comment-form">
            <div class="form-group">
                <h3>Оставить Комментарий</h3>
                <label class="name-form" for="name">Дата:</label>
                <date-picker
                    class="date-picker"
                    v-model="date"
                    valueType="format"
                    aria-required="true"
                ></date-picker>
                <br />
                <label class="name-form" for="name">Имя:</label>
                <input type="text" id="name" v-model="name" required />
            </div>
            <div class="form-group">
                <label for="comment">Комментарий:</label>
                <textarea id="text" v-model="comment" required></textarea>
            </div>
            <button
                type="submit"
                :disabled="!name || !comment || addCommentPending || !date"
            >
                Комментировать
            </button>
        </form>
    </div>
</template>

<script>
// @ts-check
import axios from "axios";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "./resources/CommentForm.css";
import { mapState, mapActions, mapGetters } from "vuex"; //Импортируем mapGetters и mapActions из "vuex"
export default {
    components: {
        DatePicker,
    },
    computed: {
        ...mapState(["comments", "isLoading", "addCommentPending"]),
        ...mapGetters(["nextId"]),
    },
    data() {
        return {
            name: "",
            comment: "",
            date: "",
            // comments: [],
            // loading: false,
            // listLoading: false,
            page: 1,
            pages: [1],
            sortType: "asc",
        };
    },
    methods: {
        ...mapActions([
            "setLoading",
            "fetchComments",
            "deleteComment",
            "addComment",
            "addCommentOptimistic",
        ]),
        sortComments(type) {
            // this.$store.dispatch("actionName", type);
            if (type === "id") {
                this.comments.sort((a, b) => {
                    if (this.sortType === "asc") {
                        return a.id - b.id;
                    } else {
                        return b.id - a.id;
                    }
                });
            } else if (type === "date") {
                this.comments.sort((a, b) => {
                    if (this.sortType === "asc") {
                        return new Date(a.date) - new Date(b.date);
                    } else {
                        return new Date(b.date) - new Date(a.date);
                    }
                });
            }
        },
        changePage(p) {
            this.page = p;
        },
        // Component.submitComment()
        submitComment() {
            // this.comments.push({
            //     author: this.name,
            //     content: this.comment,
            //     date: this.date,
            //     id: this.comments.length
            //         ? Math.max(...this.comments.map((item) => item.id)) + 1
            //         : 1,
            // });
            const optimisticId = this.nextId;
            this.addCommentOptimistic({
                author: this.name,
                content: this.comment,
                date: this.date,
                id: optimisticId,
            });
            let pageAdded = false;
            if ((this.comments.length - 1) % 3 === 0) {
                this.pages.push(this.pages.at(-1) + 1);
                pageAdded = true;
            }
            // Очищаем поля ввода
            const name = this.name;
            const text = this.comment;
            const date = this.date;
            this.name = "";
            this.comment = "";
            this.addComment({
                comment: {
                    name,
                    date,
                    text,
                },
                optimisticId,
                catchCallback: () => {
                    if (pageAdded) {
                        this.pages.pop();
                    }
                },
            });
            // this.loading = true;
            // axios // XMLHttpRequest
            //     .post("/api/comments", {
            //         name,
            //         date,
            //         text,
            //     })
            //     .then((response) => {
            //         this.loading = false;
            //         this.comments[this.comments.length - 1] = response.data;
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //         this.loading = false;
            //         this.comments.pop();
            //         if (pageAdded) {
            //             this.pages.pop();
            //         }
            //         // Обработка ошибок
            //     });
        },
        deleteCommentLocal(id) {
            console.log(this.comments);
            if ((this.comments.length - 1) % 3 === 0) {
                // if (this.page === this.pages.at(-1)) {
                if (this.page > 1) {
                    this.page -= 1;
                }
                this.pages.pop();
            }
            // this.$store.dispatch("deleteComment", id);
            this.deleteComment(id);
            // let i = this.comments.map((item) => item.id).indexOf(id);
            // this.comments.splice(i, 1);
            // deleteComment(id)
            //     .then((response) => {})
            //     .catch((error) => {
            //         console.error(error);
            //         // Обработка ошибок
            //     });
        },
        fetchCommentsLocal() {
            this.fetchComments(() => {
                this.pages = Array.from({
                    length: Math.ceil(this.comments.length / 3),
                }).map((_, i) => i + 1);
            });

            //     this.listLoading = true;
            //     axios
            //         .get("/api/comments")
            //         .then((response) => {
            //             // Загружаем комментарии при загрузке компонента
            //             this.comments = response.data;
            //             this.pages = Array.from({
            //                 length: Math.ceil(this.comments.length / 3),
            //             }).map((_, i) => i + 1);
            //             this.listLoading = false;
            //         })
            //         .catch((error) => {
            //             console.error(error);
            //             this.listLoading = false;
            //             // Обработка ошибок
            //         });
        },
    },
    created() {
        // Выполняем загрузку комментариев при создании компонента
        this.fetchCommentsLocal();
    },
};
</script>
