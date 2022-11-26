import { render, screen } from "@testing-library/react";
import Footer, {space} from "main/components/Nav/Footer";
import { QueryClient, QueryClientProvider } from 'react-query';

describe("Footer tests", () => {
  const queryClient = new QueryClient()
    test("space stands for a space", () => {
        expect(space).toBe(" ");
      });
    
    
      test("renders without crashing", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <Footer />
          </QueryClientProvider>);
      });
    
      test("Links are correct", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <Footer />
          </QueryClientProvider>)
        expect(screen.getByTestId("footer-class-website-link")).toHaveAttribute(
          "href",
          "https://ucsb-cs156.github.io"
        );
        expect(screen.getByTestId("footer-ucsb-link")).toHaveAttribute(
          "href",
          "https://ucsb.edu"
        );
        expect(screen.getByTestId("footer-source-code-link")).toHaveAttribute(
          "href",
          "https://github.com/ucsb-cs156/proj-courses"
        );

        expect(screen.getByTestId("footer-sticker-link")).toHaveAttribute(
            "href",
            "https://www.as.ucsb.edu/sticker-packs"
          );
          expect(screen.getByTestId("footer-course-search-link")).toHaveAttribute(
            "href",
            "https://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx"
          );

      });
});
