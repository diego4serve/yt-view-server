import * as dejs from "https://deno.land/x/dejs@0.10.3/mod.ts";
import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.203.0/path/mod.ts";

const port = parseInt(Deno.env.get("YT_PORT") || "") || 3999;

Deno.serve({ port }, async (req: Request) => {
  try {
    const url = new URL(req.url);
    if (url.pathname !== "/") {
      return new Response("Bad request", { status: 400 });
    }

    const searchParams = new URLSearchParams(url.searchParams);
    const video = searchParams.get("video");
    const playlist = searchParams.get("playlist");
    const baseURL = "https://www.youtube.com/embed/";

    let src;
    if (playlist) {
      src = `${baseURL}videoseries?list=${playlist}`;
    } else if (video) {
      src = `${baseURL + video}`;
    }

    const response = await dejs.renderFileToString(
      `${dirname(fromFileUrl(import.meta.url))}/public/index.ejs`,
      { src },
    );

    return new Response(response, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (_error) {
    return new Response("Internal server error", { status: 500 });
  }
});
