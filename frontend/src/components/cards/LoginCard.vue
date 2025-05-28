<script setup>
import BaseButton from '../buttons/BaseButton.vue';
import { ref } from 'vue';

const emit = defineEmits(['login']);

const email = ref('');
const password = ref('');

const loginUser = () =>{
  if(email.value.trim() && password.value.trim()){
    emit('login',{
      email: email.value.trim(),
      password: password.value.trim()
    });
    email.value = '';
    password.value = '';
  }
}

</script>



<template>
    <div class="card login-card">
        <div class="card-header">
            <i class="bi-person-circle login-icon"></i>
            <h2>Tukarbaca Login</h2>
        </div>
        <div class="card-body">
            <form id="login-form">
                <div class="form-floating">
                    <input type="email" class="form-control" id="email" placeholder="nama@contoh.com" v-model="email" required>
                    <label for="email"><i class="bi-envelope-fill me-2"></i>Email</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model="password" required>
                    <label for="password"><i class="bi-lock-fill me-2"></i>Password</label>
                </div>
                <BaseButton type="primary" class="w-100" @click="loginUser">Login</BaseButton>
            </form>
            <div class="register-link">
                <p>Belum punya akun? <router-link to="/register">Register</router-link></p>
            </div>
        </div>
    </div>
</template>


<style scoped>
   .login-card {
            min-width: 400px;
            width: 100%;
            padding: 0;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
            background-color: #4e73df;
            color: white;
            text-align: center;
            padding: 25px;
            border-bottom: none;
        }
        
        .card-header h2 {
            margin-bottom: 0;
            font-weight: 700;
        }
        
        .card-body {
            padding: 30px;
        }
        
        .form-floating {
            margin-bottom: 20px;
        }
        
        .form-floating label {
            color: #6c757d;
        }
        
        .form-control:focus {
            border-color: #4e73df;
            box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
        }
        .register-link {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
        }
        
        .register-link a {
            color: #4e73df;
            text-decoration: none;
            font-weight: 600;
        }
        
        .register-link a:hover {
            text-decoration: underline;
        }
        
        .login-icon {
            font-size: 60px;
            margin-bottom: 15px;
        }


</style>