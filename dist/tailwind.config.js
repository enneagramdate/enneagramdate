export default {
    content: ['./client/**/*.{html,js,jsx,tsx,ts}', './public/index.html'],
    theme: {
        container: {
            center: true,
        },
        colors: {
            9: '#EC50B6',
            8: '#CF0010',
            7: '#F8A400',
            6: '#FBD504',
            5: '#78CD34',
            4: '#32A75F',
            3: '#329F9D',
            2: '#21669E',
            1: '#2826A7',
            black: '#414A4C',
            white: '#F8F8FF',
        },
        fontFamily: {},
        extend: {},
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#ae5fd3',
                    secondary: '#fc11c1',
                    accent: '#63dda4',
                    neutral: '#3b2a3c',
                    'base-100': '#3d313f',
                    info: '#359df3',
                    success: '#22c9b0',
                    warning: '#fbab56',
                    error: '#f26475',
                },
            },
        ],
    },
    plugins: [require('daisyui')],
};
//# sourceMappingURL=tailwind.config.js.map