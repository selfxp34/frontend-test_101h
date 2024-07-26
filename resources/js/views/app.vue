<template>
    <div>
        <header-component></header-component>
        <comment-form></comment-form>
    </div>
</template>

<script>
import CommentForm from "./CommentForm.vue";
import HeaderComponent from "./HeaderComponent.vue";

export default {
    components: {
        HeaderComponent,
        CommentForm,
    },
    data() {
        return {};
    },
};
</script>
