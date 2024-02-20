import React from "react";

const SearchTabContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  focusSearchInputRef: { current: () => {} },
});

export default SearchTabContext;
