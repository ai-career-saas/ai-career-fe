import fs from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";

try {
  const ast = await openapiTS(
    `${process.env.NEXT_PUBLIC_NEST_API_URL ?? "http://localhost:4000/api"}/api/docs-json`,
  );
  const contents = astToString(ast);

  fs.writeFileSync("./utils/api/schema.d.ts", contents);

  console.info("✅ Successfully generated API types");
} catch (error) {
  console.error("❌ Failed to generate API types:", error);
  process.exit(1);
}
