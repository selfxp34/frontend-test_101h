<template>
    <header>
        <nav>
            <ul>
                <li><a href="#">Главная</a></li>
                <li><a href="#">Комментарии</a></li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: "Header",
};
</script>

<style>
header {
    margin: 0%;
    padding: 50px;
    background-color: #fbf0f0;
    border-bottom: 3px solid #ccc;
    box-shadow: 0px 5px 7px #9c9393;
    border-radius: 10px;
}
nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

nav ul li {
    display: inline-block;
    margin-right: 10px;
}

nav ul li a {
    color: #000000;
    text-decoration: none;
}
</style>
