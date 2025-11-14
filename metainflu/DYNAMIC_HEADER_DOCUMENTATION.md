# Dynamic Mobile Header Documentation

This document outlines the solution implemented to prevent the mobile header from overlapping page content on devices with notches or camera holes.

## What was updated

Two files were modified to implement this solution:

1.  **`frontend/client-app/src/App.vue`**: The main application component was updated to dynamically calculate and apply padding to the main content area.
2.  **`frontend/client-app/src/components/MobileHeader.vue`**: The mobile header component was updated to include a bottom padding and a box shadow for better visual separation.

## Why it was updated

The universal mobile header was causing UI problems on mobile devices by slightly covering the other pages when it tried to adjust for camera holes and notches. A static padding on the main content area was not sufficient, as the height of the safe area varies across devices. A dynamic solution was needed to ensure the content is always displayed below the header, regardless of the device's screen layout.

## How it works

The solution works by dynamically calculating the `padding-top` of the main content area based on the height of the mobile header.

### `App.vue`

-   A `ref` (`mobileHeaderRef`) was added to the `<MobileHeader>` component to get a direct reference to the component instance.
-   A `mobileHeaderHeight` `ref` was created to store the calculated height of the header.
-   The `calculateHeaderHeight` function gets the `offsetHeight` of the header element and updates the `mobileHeaderHeight` `ref`.
-   The `onMounted` lifecycle hook calls `calculateHeaderHeight` initially and adds a resize event listener to recalculate the height when the window is resized.
-   The `onUnmounted` lifecycle hook removes the resize event listener to prevent memory leaks.
-   The `padding-top` of the `main` element is bound to the `mobileHeaderHeight` `ref`, so it automatically updates whenever the header height changes.

### `MobileHeader.vue`

-   The header already included `padding-top: env(safe-area-inset-top);` to account for the safe area at the top of the screen.
-   A `padding-bottom: 0.5rem;` was added to create some visual separation between the header and the content.
-   A `box-shadow: 0 2px 4px rgba(0,0,0,0.1);` was added to give the header a slight visual lift from the content.

## How to use it in other projects

To implement this solution in other Vue.js projects, follow these steps:

1.  **Identify your main application component** (e.g., `App.vue`) and your **mobile header component**.
2.  **In your main application component:**
    -   Add a `ref` to your mobile header component.
    -   Create a `ref` to store the header height.
    -   Create a function to calculate the header height and update the height `ref`.
    -   Call this function in the `onMounted` hook and add a resize event listener.
    -   Remove the event listener in the `onUnmounted` hook.
    -   Bind the `padding-top` of your main content area to the header height `ref`.
3.  **In your mobile header component:**
    -   Add `padding-top: env(safe-area-inset-top);` to the header element's style to account for the device's safe area.
    -   Consider adding a `padding-bottom` and `box-shadow` for better visual separation.

This approach ensures that your application's layout is responsive and adapts to the screen layout of various mobile devices, providing a better user experience.
