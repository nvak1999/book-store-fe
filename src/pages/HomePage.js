import React from "react";
import BookList from "../features/book/BookList";
import MainHeader from "../layouts/MainHeader";

function HomePage() {
  return (
    <div>
      <MainHeader />
      <BookList />
    </div>
  );
}

export default HomePage;
