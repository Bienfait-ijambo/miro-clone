<script lang="ts" setup>
//

const props = defineProps<{
    mousePosition: {
        x: number;
        y: number;
    };
}>();
</script>
<template>
    <div
        class="cursor"
        :style="{
            left: mousePosition.x + 'px',
            top: mousePosition.y + 'px',
        }"
    >
        <span class="cursor-label px-2 py-2">Elisabeth</span>


        <svg
        style="
                position: relative;
                left: -60px;
                font-weight: bold;
                color: red;
            "
            width="20"
            height="20"
           
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            fill="#3cc3cd"
            stroke="#3cc3cd"
            transform="rotate(0)"
        >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="#b10606"
                stroke-width="9.216"
            >
                <path
                    fill="#d73e23"
                    d="M123.193 29.635L121 406.18l84.31-82.836 65.87 159.02 67.5-27.96-65.87-159.02L391 294.342z"
                ></path>
            </g>
            <g id="SVGRepo_iconCarrier">
                <path
                    fill="#d73e23"
                    d="M123.193 29.635L121 406.18l84.31-82.836 65.87 159.02 67.5-27.96-65.87-159.02L391 294.342z"
                ></path>
            </g>
        </svg>
      
    </div>
</template>
<style scoped>
.cursor {
    position: absolute;
    pointer-events: none;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #4a90e2;
    /* cursor: none; */
}
.cursor-label {
    display: block;
    background: #0b69d3;
    color: white;
    font-weight: 500;
    padding: 2px;
    border-radius: 5px;
    position: relative;
    left: -70px;
    font-size: 12px;
    /* margin-right: 100px; */
}
cursor-hover {
    box-shadow: 0 6px 12px rgb(0, 0, 0, 0.15);
    transition: box-shadow 0.2s ease;
}
</style>
