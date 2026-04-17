import axios from "axios";

export async function getWorkflowRuns(owner, repo) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}