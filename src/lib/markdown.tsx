import { compile } from "@mdx-js/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export async function ContentBody({ source }: { source: string }) {
  await compile(source, { remarkPlugins: [remarkGfm] });
  return (
    <MDXRemote
      source={source}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      components={{
        a: (props) => <a {...props} target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" />,
      }}
    />
  );
}
