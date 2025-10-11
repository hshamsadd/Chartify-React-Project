const routeForSlide = (slide) => {
  const type = slide?.kind || slide?.type;
  const id = slide?.id;
  if (!id) return "/";

  switch (type) {
    case "track":
      return `/track/${id}`;
    case "album":
      return `/album/${id}`;
    case "artist":
      return `/artist/${id}`;
    case "playlist":
      return `/playlist/${id}`;
    case "podcast":
      return `/podcast/${id}`;
    default: {
      // Fallback heuristics if kind/type is missing
      if (slide.nb_tracks != null || slide.public != null)
        return `/playlist/${id}`;
      if (slide.fans != null && slide.available_podcasts)
        return `/podcast/${id}`;
      if (slide.duration != null && (slide.preview || slide.path))
        return `/track/${id}`;
      if (slide.artist && slide.cover && slide.title) return `/album/${id}`;
      return `/playlist/${id}`;
    }
  }
};
export default routeForSlide;
