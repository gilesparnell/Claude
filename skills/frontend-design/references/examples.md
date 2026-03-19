# Frontend Design Reference Examples

## Good Button Pattern

```tsx
// Primary button — clear hierarchy, accessible focus ring
<button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors">
  Get started
</button>
```

## Good Form Field Pattern

```tsx
<div className="flex flex-col gap-1.5">
  <label htmlFor="email" className="text-sm font-medium text-gray-700">
    Email address
  </label>
  <input
    id="email"
    type="email"
    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
    placeholder="you@example.com"
  />
  <p className="text-xs text-red-600">Please enter a valid email address</p>
</div>
```

## Good Empty State Pattern

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <InboxIcon className="w-6 h-6 text-gray-400" />
  </div>
  <h3 className="text-sm font-semibold text-gray-900 mb-1">No results</h3>
  <p className="text-sm text-gray-500 max-w-xs">
    Try adjusting your search or filters to find what you're looking for.
  </p>
</div>
```
