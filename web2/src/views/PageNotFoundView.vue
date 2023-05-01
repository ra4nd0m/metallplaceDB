<template>
    <div class="page-not-found">
        <h1 class="page-not-found__title">404 - Page Not Found</h1>
        <p class="page-not-found__message">Страница не найдена.</p>
    </div>
</template>

<script>
export default {
    name: "PageNotFoundView"
}
</script>

<style scoped>
.page-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    text-align: center;
}

.page-not-found__title {
    font-size: 4rem;
    margin-bottom: 2rem;
}

.page-not-found__message {
    font-size: 2rem;
    margin-bottom: 2rem;
}

.page-not-found__link {
    font-size: 1.5rem;
    color: #007bff;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
}

.page-not-found__link:hover {
    color: #0056b3;
}
</style>
