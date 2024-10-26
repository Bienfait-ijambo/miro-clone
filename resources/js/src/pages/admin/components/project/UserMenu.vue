<script lang="ts" setup>
import { LoginResponseType } from "../../../../helper/auth";

const props = defineProps<{
    showMenu: boolean;
    user: LoginResponseType | undefined;
}>();

const emit = defineEmits<{
    (e: "logout"): Promise<void>;
}>();
</script>
<template>
    <ul
        v-show="showMenu"
        class="bg-white mt-5 rounded-md shadow-lg w-[250px] py-2 px-4 divide-y divide-gray-200 absolute right-4"
    >
        <li class="py-2 px-4 hover:cursor-pointer">
            {{ user?.user?.name }} <br />
            <a href="http://" class="text-blue-500">
                {{ user?.user?.email }}
            </a>
        </li>
        <li
            @click="emit('logout')"
            class="flex py-2 px-4 hover:bg-gray-50 rounded-md text-red-500 hover:cursor-pointer"
        >
            <span class="pt-1">
                <LogoutIcon />
            </span>
            <span>Logout</span>
        </li>
    </ul>
</template>
