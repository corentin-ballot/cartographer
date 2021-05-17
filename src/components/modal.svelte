<script>
    import { DialogOverlay, DialogContent } from 'svelte-accessible-dialog';
    import { isOpen, selectedCell } from '../stores/modal';
    import { cells } from '../stores/board';
    import { initCell, selectableTypes } from "../utils/cells";
    import Cell from './cell.svelte';

    let types = selectableTypes();
  
    const open = () => {
      $isOpen = true;
    };
    const close = () => {
      $isOpen = false;
    };

    const selectType = (type) => {
        $cells = $cells.map(c => c.id == $selectedCell ? {...c, type}:c)
        close();
    }
</script>
  
  <DialogOverlay isOpen={$isOpen} onDismiss={close} class="overlay">
    <DialogContent aria-label="Announcement" class="content">
            <button on:click={close} class="close" aria-label="close"><svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path fill="currentColor" d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg></button>
            <h1>Select type</h1>
            <p>Select the type the cell should be applied : </p>
            <div class="cells">
                {#each selectableTypes() as type}
                    <Cell data={initCell(0, type.id)} cellsPerLine={types.length / 2} click={() => selectType(type.id)} />
                {/each}
            </div>
    </DialogContent>
  </DialogOverlay>

<style>
    :global([data-svelte-dialog-overlay].overlay) {
        background-color: rgba(0, 0, 0, 0.7);
    }

    :global([data-svelte-dialog-content].content) {
        position: relative;
        border: 2px solid #000;
        padding: 16px;
        width: 72vw;
    }

    .close {
        cursor: pointer;
        position: absolute;
        right: -32px;
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        width: 32px;
        height: 32px;
        color: white;
    }

    .cells {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    h1 {
        margin-top: 0;
    }

    @media (min-width: 640px) {
        :global([data-svelte-dialog-content].content) {
            width: 50vw;
        }
    }
</style>