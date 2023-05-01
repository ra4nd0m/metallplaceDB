<template>
    <v-container fluid fill-height>

        <v-row align="center" justify="center">
            <v-col cols="12">
                <v-card class="elevation-12">
                    <v-card-title class="text-center">Login</v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="username" label="Username"></v-text-field>
                            <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                            <v-btn @click="login">Login</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import agent from "@/addAuthToken";
import store from "@/store";
import router from "@/router";

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            isLoggedIn: false,
        };
    },
    methods: {
        async login() {
            const response = await agent.post("/login", {
                    username: this.username,
                    password: this.password,
            }, true);
            if (response.status === 200) {
                const json = await response.json()
                console.log("Login req json ",json);
                await store.dispatch('login', {token: json.token})
                this.isLoggedIn = true;
                await router.push({path: '/'})
            } else {
                alert("Login failed");
            }
        },
    },
    mounted() {
        const token = store.getters.getToken ? store.state.token : null
        if (token) {
            this.isLoggedIn = true;
        }
    },
};
</script>

<style scoped>
.elevation-12 {
    max-width: 400px;
    margin: auto;
    font-family: 'Montserrat Medium', sans-serif;
}
</style>
