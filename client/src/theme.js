// export const colorTokens = {
//   grey: {
//     0: "#FFFFFF",
//     10: "#F6F6F6",
//     50: "#FAF0E6",
//     100: "#E0E0E0",
//     200: "#C2C2C2",
//     300: "#A3A3A3",
//     400: "#858585",
//     500: "#666666",
//     600: "#4D4D4D",
//     700: "#333333",
//     800: "#1A1A1A",
//     900: "#0A0A0A",
//     1000: "#000000",
//   },
//   primary: {
//     50: "#E6FBFF",
//     100: "#CCF7FE",
//     200: "#99EEFD",
//     300: "#66E6FC",
//     400: "#33DDFB",
//     500: "#00D5FA",
//     600: "#00A0BC",
//     700: "#006B7D",
//     800: "#00353F",
//     900: "#001519",
//   },
// };

// // mui theme settings
// export const themeSettings = (mode) => {
//   return {
//     palette: {
//       mode: mode,
//       ...(mode === "dark"
//         ? {
//           //dark mode
//           primary: {
//             dark: colorTokens.primary[200],
//             main: colorTokens.primary[500],
//             light: colorTokens.primary[800],
//           },
//           neutral: {
//             dark: colorTokens.grey[100],
//             main: colorTokens.grey[200],
//             mediumMain: colorTokens.grey[300],
//             medium: colorTokens.grey[400],
//             light: colorTokens.grey[700],
//           },
//           background: {
//             default: colorTokens.grey[900],
//             alt: colorTokens.grey[800],
//           },
//         }
//         : {
//           // light mode
//           primary: {
//             dark: colorTokens.primary[700],
//             main: colorTokens.primary[500],
//             light: colorTokens.primary[50],
//           },
//           neutral: {
//             dark: colorTokens.grey[700],
//             main: colorTokens.grey[500],
//             mediumMain: colorTokens.grey[400],
//             medium: colorTokens.grey[300],
//             light: colorTokens.grey[10],
//           },
//           background: {
//             default: colorTokens.primary[50],
//             alt: colorTokens.grey[0],
//           },
//         }),
//     },
//     typography: {
//       fontFamily: ["Roboto", "sans-serif"].join(","),
//       fontSize: 12,
//       h1: {
//         fontFamily: ["Roboto", "sans-serif"].join(","),
//         fontSize: 40,
//       },
//       h2: {
//         fontFamily: ["Roboto", "sans-serif"].join(","),
//         fontSize: 32,
//       },
//       h3: {
//         fontFamily: ["Roboto", "sans-serif"].join(","),
//         fontSize: 24,
//       },
//       h4: {
//         fontFamily: ["Roboto", "sans-serif"].join(","),
//         fontSize: 20,
//       },
//       h5: {
//         fontFamily: ["Roboto", "sans-serif"].join(","),
//         fontSize: 16,
//       },
//       h6: {
//         fontFamily: ["Roboto", "sans-serif"].join(","),
//         fontSize: 14,
//       },
//     },
//   };
// };

export const colorTokens = {
  grey: {
    0: "#FFFFFF", // Trắng tinh khôi
    10: "#F8F4F0", // Trắng ngà
    50: "#F2EDEB", // Be nhạt
    100: "#D9D6D2", // Xám nhạt
    200: "#BFB8B4", // Xám trung tính
    300: "#A59E9A", // Xám nâu nhẹ
    400: "#8B8581", // Nâu nhạt
    500: "#726D69", // Nâu đất
    600: "#5A5450", // Xám đậm
    700: "#413D3A", // Đen nhẹ
    800: "#2A2725", // Đen nâu
    900: "#151312", // Đen sẫm
    1000: "#000000", // Đen tuyền
  },
  primary: {
    50: "#FDEFF4", // Hồng nhạt (cánh sen nhạt)
    100: "#FBD8E8", // Hồng pastel
    200: "#F7AAC8", // Hồng sen
    300: "#F37CA8", // Hồng đỏ nhạt
    400: "#EF4E88", // Hồng đỏ (cánh sen đậm)
    500: "#EB2068", // Hồng sen đậm
    600: "#B51953", // Hồng tím đậm
    700: "#7F123E", // Đỏ tím
    800: "#490A29", // Tím nâu
    900: "#240514", // Tím đậm
  },
  secondary: {
    50: "#EAF6E6", // Xanh lá nhạt (lá sen non)
    100: "#D2EBC9", // Xanh pastel
    200: "#A6D896", // Xanh lá trung tính
    300: "#79C463", // Xanh lá tươi
    400: "#4DA030", // Xanh lá sen đậm
    500: "#317318", // Xanh đậm
    600: "#255511", // Xanh tối
    700: "#19370A", // Xanh rêu
    800: "#0E1A05", // Xanh đen
    900: "#050B02", // Xanh đen đậm
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // Dark mode
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[500],
              light: colorTokens.primary[700],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[300],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[500],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
            },
          }
        : {
            // Light mode
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
            },
            secondary: {
              dark: colorTokens.secondary[400],
              main: colorTokens.secondary[300],
              light: colorTokens.secondary[100],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[10],
            },
            background: {
              default: colorTokens.grey[200],
              alt: colorTokens.grey[100],
            },
          }),
    },
    typography: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};