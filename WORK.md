Drawing Contrasts from Ref vs State and Specifying Event Runtimes using React Utilities

Right now, the canvas is a react ref and all fabric attribute functions on the canvas object
are called from the React ref.current property.

Look into scope and environment properties on ref,
for example, how it binds to and interacts with React Component.

Consider swapping ref out for state.

Draw contrasts between the scope and environment properties on state, likewise
how it binds to and interacts with React Component.

As of now, functionality is implemented in the React callback function useEffect, which has specific
scope, invocation and runtime. I think looking into when useEffect is invoked, as well as other options
for calling fabric functions would be good.

If necessary you can attempt to compare these to structural functions such as useEffect and useState to functions like initModal() and $(document).ready() in the connect-the-dots-game example, as well as any relevant jquery, and js functions or utils that determine
how often events in script.js fire, and when different fabric objects are instantiated.

Off the top of my head, I don't know why these events need to be in a React function like useEffect at all, they could serve
as component attributes in the React Component and invoked on the occurence of their corresponding event. However, canvas should be
stored as a ref or in state.
