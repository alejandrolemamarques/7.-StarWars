# Understanding `NavLink` Active Class with CSS Modules

When using `react-router-dom`'s `NavLink` component, it automatically adds the class `active` to the underlying `<a>` tag when the link's path matches the current URL. This is useful for styling the currently active navigation link.

However, when using CSS Modules (like `NavBar.module.css` in this project), a complication arises.

## The Problem: CSS Module Class Hashing

CSS Modules prevent style conflicts by automatically generating unique class names during the build process. For example, a class defined as `.active` in your CSS module file:

**`src/components/NavBar/NavBar.module.css`:**

```css
.container {
    /* ... other styles ... */
    & .links {
        /* ... other styles ... */
        & > a {
            /* ... other styles ... */

            &.active {
                color: #fff; /* Changed active color to white */
                border-bottom: 3px solid #007bff; /* Added blue bottom border */
                margin-bottom: -1px; /* Align bottom border with container border */
            }
        }
    }
    /* ... other styles ... */
}
```

Might be transformed into something like `NavBar_active__aBcDeF` in the actual browser DOM. In our JavaScript/TypeScript code, we access this hashed name via the `styles` object imported from the CSS module, like `styles.active`.

The default `active` class that `NavLink` adds is just the literal string `"active"`. This literal string **does not match** the hashed class name (`styles.active` -> `NavBar_active__aBcDeF`). Therefore, the styles defined in `.active` within the CSS module won't apply automatically.

## The Solution: Using the `className` Function Prop

`NavLink` provides a solution for this. Its `className` prop can accept a function instead of just a string. This function receives an object containing an `isActive` boolean property. We can use this function to conditionally apply the _correct, hashed_ CSS Module class name.

In `src/components/NavBar/NavBar.tsx`, we implemented this using a helper function `getNavLinkClassName`:

**`src/components/NavBar/NavBar.tsx`:**

```typescript jsx
import styles from "./NavBar.module.css";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/images/star-wars-logo-crop.webp";

const NavBar = () => {
    // Helper function to determine the className for NavLink
    const getNavLinkClassName = ({
        isActive,
    }: {
        isActive: boolean;
    }): string => {
        // Returns the hashed 'styles.active' class ONLY when the link isActive
        return isActive ? styles.active : "";
    };

    return (
        <div className={styles.container}>
            <Link to="/">
                <img className={styles.logo} src={logo} alt="Star Wars Logo" />
            </Link>
            <div className={styles.links}>
                {/* Use the function form for className */}
                <NavLink to="/" className={getNavLinkClassName}>
                    HOME
                </NavLink>
                <NavLink to="/starships" className={getNavLinkClassName}>
                    STARSHIPS
                </NavLink>
            </div>
        </div>
    );
};

export default NavBar;
```

Here, `className={getNavLinkClassName}` passes the helper function to `NavLink`. When a link is active, `isActive` is true, and the function returns `styles.active` (the correct hashed class name), applying our desired styles. When it's not active, it returns an empty string, applying no extra class.

This ensures that the active link styling works correctly even when using CSS Modules.
