<template>

</template>

<script>
export default {
    name: "LogoutView",
    mounted() {
        this.$store.dispatch("logout").then(() => {
            this.$router.push({path: "/login"})
        })

    }
}

</script>

