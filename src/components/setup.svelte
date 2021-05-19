<script>
    import { title, scoring } from "../stores/board";
    import { rules } from "../utils/rules"
    import Board from "./board.svelte";

    let step = 0;
    let steps = 5;

    const handleConfirm = (e) => {
        e.preventDefault();
        step ++;
    }
</script>

{#if step < steps}
<div class="container">
    <div class="stepper">
        <form class="step" class:current={step==0} class:passed={step>0} on:submit={handleConfirm}>
            <img src="../assets/img/map.svg" alt="" class="logo"/>

            <label for="title" class="label">Map title</label>
            <input type="text" id="title" name="title" class="input" bind:value={$title}/>

            <button class="confirm">Confirm</button>
        </form>

        <form class="step" class:current={step==1} class:passed={step>1} on:submit={handleConfirm}>
            <div class="logo" style="background-image:url('../assets/img/scoring.svg')"><span style="padding: 14px;line-height: 48px;font-size: 24px;font-family: cursive;">A</span></div>

            <label for="title" class="label">Scoring A</label>
            <select bind:value={$scoring[0]} required>
                <option selected disabled value="">Select scoring card</option>
                {#each rules.map(r => r.type).filter((r,i,a) => a.indexOf(r) == i) as type}
                <optgroup label={type}>
                    {#each rules.filter(r => r.type == type) as rule}
                    <option value={rule}>{rule.name}</option>
                    {/each}
                </optgroup> 
                {/each}
            </select>

            <button class="confirm">Confirm</button>
        </form>

        <form class="step" class:current={step==2} class:passed={step>2} on:submit={handleConfirm}>
            <div class="logo" style="background-image:url('../assets/img/scoring.svg')"><span style="padding: 14px;line-height: 48px;font-size: 24px;font-family: cursive;">B</span></div>

            <label for="title" class="label">Scoring B</label>
            <select bind:value={$scoring[1]} required>
                <option selected disabled value="">Select scoring card</option>
                {#each rules.map(r => r.type).filter((r,i,a) => a.indexOf(r) == i) as type}
                <optgroup label={type}>
                    {#each rules.filter(r => r.type == type) as rule}
                    <option value={rule}>{rule.name}</option>
                    {/each}
                </optgroup> 
                {/each}
            </select>

            <button class="confirm">Confirm</button>
        </form>

        <form class="step" class:current={step==3} class:passed={step>3} on:submit={handleConfirm}>
            <div class="logo" style="background-image:url('../assets/img/scoring.svg')"><span style="padding: 14px;line-height: 48px;font-size: 24px;font-family: cursive;">C</span></div>

            <label for="title" class="label">Scoring C</label>
            <select bind:value={$scoring[2]} required>
                <option selected disabled value="">Select scoring card</option>
                {#each rules.map(r => r.type).filter((r,i,a) => a.indexOf(r) == i) as type}
                <optgroup label={type}>
                    {#each rules.filter(r => r.type == type) as rule}
                    <option value={rule}>{rule.name}</option>
                    {/each}
                </optgroup> 
                {/each}
            </select>

            <button class="confirm">Confirm</button>
        </form>

        <form class="step" class:current={step==4} class:passed={step>4} on:submit={handleConfirm}>
            <div class="logo" style="background-image:url('../assets/img/scoring.svg')"><span style="padding: 14px;line-height: 48px;font-size: 24px;font-family: cursive;">D</span></div>

            <label for="title" class="label">Scoring D</label>
            <select bind:value={$scoring[3]} required>
                <option selected disabled value="">Select scoring card</option>
                {#each rules.map(r => r.type).filter((r,i,a) => a.indexOf(r) == i) as type}
                <optgroup label={type}>
                    {#each rules.filter(r => r.type == type) as rule}
                    <option value={rule}>{rule.name}</option>
                    {/each}
                </optgroup> 
                {/each}
            </select>

            <button class="confirm">Confirm</button>
        </form>
    </div>
</div>
{:else}
    <Board />
{/if}

<style>
    .container {
        width: 100%;
        height: 95vh;
        display: flex;
        justify-content: center;
    }

    .stepper {
        padding: 6px;
        max-width: 280px;
        width: 100%;
        box-shadow: 0px 0px 3px 0px #CDCDCD;
        position: relative;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        align-self: center;
        position: absolute;
        left: 240px;
        transition: all ease .5s;
        opacity: 0;
        left: 240px;
    }

    .step.current {
        position: relative;
        opacity: 1;
        left: 0px;
    }

    .step.passed {
        display: flex;
        opacity: 0;
        left: -240px;
    }

    .logo {
        width: 48px;
        height: 48px;
        display: block;
        margin: -24px auto 16px;
        position: relative;
    }

    .label {
        color: #ff3e00;
        text-transform: uppercase;
        margin: 0 0 8px 0;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        .stepper {
            align-self: flex-start;
            margin-top: 96px;
        }
    }
</style>