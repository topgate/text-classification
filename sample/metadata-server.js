const metadataServerPath = "http://metadata.google.internal/";

const getMetadata = (path) => {
    return fetch(metadataServerPath + path, {
        headers: [["Metadata-Flavor", "Google"]],
    }).then((res) => res.text());
};

export const project = await getMetadata(
    "computeMetadata/v1/project/project-id",
).catch(() => process.env.PROJECT_ID ?? "");

export const location = await getMetadata("computeMetadata/v1/instance/region")
    .then((text) => text.split("/").pop() ?? "")
    .catch(() => process.env.REGION ?? "");
