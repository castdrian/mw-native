export const constructFullUrl = (playlistUrl: string, uri: string) => {
  const baseUrl = playlistUrl.substring(0, playlistUrl.lastIndexOf("/") + 1);
  return uri.startsWith("http://") || uri.startsWith("https://")
    ? uri
    : baseUrl + uri;
};
