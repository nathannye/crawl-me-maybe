import { getDocumentByType } from "@/lib/sanityClient";

export default async function Home() {
  const settings = await getDocumentByType("globalSeoSettings");

  // const data = {
  //   title: "Test Article",
  //   description: "This is a test article",
  //   image: "https://via.placeholder.com/150",
  //   url: "https://www.example.com/article",
  //   datePublished: "2021-01-01",
  //   dateModified: "2021-01-01",
  //   author: "John Doe",
  // };

  return (
    <div>
      <main>
        <h1>Page</h1>
        {/* <SchemaMarkup schemaType="Article" schemaData={data} /> */}
      </main>
    </div>
  );
}
