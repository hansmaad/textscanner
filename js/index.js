import { query } from './common/index.js';
import { home } from './home/index.js';

const app = () => {
    const view = home({ container: query('#app') });
}

document.addEventListener("DOMContentLoaded", app);
