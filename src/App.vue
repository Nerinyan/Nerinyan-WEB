<template>
<div>
    <Navbar></Navbar>
    <router-view/>
</div>
</template>

<script>
    import Navbar from './components/Navbar.vue'
    export default {
        name: 'App',
        components: {
            'Navbar': Navbar
        },
        data() {
            return {
                tab: 'home'
            }
        }
    }
</script>

<style>

</style>