import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../apiService";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  bookDetail: null,
  readinglist: [],
  status: null,
};

export const getBooks = createAsyncThunk(
  "books/getBooks",
  async ({ pageNumber, pageSize, query }) => {
    try {
      let url = `/books?_page=${pageNumber}&_limit=${pageSize}`;
      if (query) url += `&q=${query}`;
      const res = await apiService.get(url);
      return res.data;
    } catch (error) {
      return error;
    }

    // const res = await apiService.get("/books", {
    //   params: { _page: pageNumber, _limit: pageSize },
    // });
    // //   console.log(res.data);
    // return res.data;
  }
);

export const getBookDetail = createAsyncThunk(
  "book/getBookDetail",
  async (bookId) => {
    const res = await apiService.get(`/books/${bookId}`);
    return res.data;
  }
);

export const addToReadingList = createAsyncThunk(
  "book/addToReadingList",
  async (book) => {
    const res = await apiService.post(`/favorites`, book);
    return res.data;
  }
);

export const getReadingList = createAsyncThunk(
  "book/getReadingList",
  async () => {
    const res = await apiService.get(`/favorites`);
    return res.data;
  }
);

export const removeBook = createAsyncThunk(
  "book/removeBook",
  async (removedBookId) => {
    const res = await apiService.delete(`/favorites/${removedBookId}`);

    console.log(res);
    return res.data;
  }
);

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = null;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(getBookDetail.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getBookDetail.fulfilled, (state, action) => {
        state.status = null;
        state.bookDetail = action.payload;
      })
      .addCase(getBookDetail.rejected, (state, action) => {
        state.status = "failed";
      });

    builder
      .addCase(addToReadingList.pending, (state) => {
        // state.status = "pending";
      })
      .addCase(addToReadingList.fulfilled, (state, action) => {
        console.log(action.payload);
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        toast.error(action.error.message);
      });

    builder
      .addCase(getReadingList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getReadingList.fulfilled, (state, action) => {
        state.status = null;
        state.readinglist = action.payload;
      })
      .addCase(getReadingList.rejected, (state, action) => {
        state.status = "failed";
      });

    builder
      .addCase(removeBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.status = null;
        toast.success("The book has been removed");
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.status = "Failed to remove book";
      });
  },
});

// export const { increment, decrement, addCounter } = multiCounterSlice.actions;
export default bookSlice.reducer;
