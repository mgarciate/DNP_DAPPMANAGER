import Docker from "dockerode";
import { docker } from "./docker";

/**
 * Inspect container
 * @param containerNameOrId
 */
export async function containerInspect(
  containerNameOrId: string
): Promise<Docker.ContainerInspectInfo> {
  const container = docker.getContainer(containerNameOrId);
  return await container.inspect();
}