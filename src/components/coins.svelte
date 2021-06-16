<script>
   import { coins } from '../stores/score';

   const setCoin = (quantity) => {
       $coins = quantity;
   }

   const addCoin = (quantity = 1) => {
       $coins += quantity;
   }
</script>

<div class="coins">
    {#each Array.from({length: 14}, (v, k) => k) as index}
        <button class="coin" class:coin-earn={index < $coins} on:click={() => {setCoin(index+1 == $coins ? index:index+1)}}></button>
    {/each}
</div>

<style>
    .coins {
        display: flex;
        margin-bottom: 16px;
    }

    .coin {
        display: block;
        width: 100%;
        height: 32px;
        background-image: url("../assets/img/coin.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        filter: grayscale(.8);
        opacity: .5;
        cursor: pointer;
        margin: 0 4px;
        padding: 0;
        background-color: unset;
        border: none;
    }

    .coin:first-child {
        margin-left: 0;
    }
    .coin:last-child {
        margin-right: 0;
    }

    .coin-earn {
        opacity: 1;
        filter: grayscale(0);
    }
</style>