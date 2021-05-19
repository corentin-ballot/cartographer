<script>
    import { username } from "../stores/user";

    let name = $username;

    const handleConfirm = (e) => {
        e.preventDefault();
        $username = name;
    }
</script>

<div class="login-container">
    <form class="login" on:submit={handleConfirm}>
        <img src="../assets/img/compass.svg" alt="" class="logo"/>

        <label for="username" class="label">Cartographer</label>
        <input type="text" id="username" name="username" class="input" bind:value={name}/>

        <button class="confirm">Confirm</button>
    </form>
</div>

<style>
    .login-container {
        width: 100%;
        height: 95vh;
        display: flex;
        justify-content: center;
    }

    .login {
        padding: 6px;
        max-width: 280px;
        width: 100%;
        box-shadow: 0px 0px 3px 0px #CDCDCD;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        align-self: center;
    }

    .logo {
        width: 48px;
        height: 48px;
        display: block;
        margin: -24px auto 16px;
    }

    .label {
        color: #ff3e00;
        text-transform: uppercase;
        margin: 0 0 8px 0;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        .login {
            align-self: flex-start;
            margin-top: 96px;
        }
    }
</style>