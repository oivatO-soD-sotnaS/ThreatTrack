"use server"

import { prisma } from "@/lib/prisma";

// --- TO_DO_ITEM CRUD ---
export const createToDoItem = async (vulnerabilityId: string) => {
  return prisma.to_do_item.create({
    data: { vulnerabilityId },
  });
};

export const getToDoItem = async (id: number) => {
  return prisma.to_do_item.findUnique({
    where: { id },
    include: { n8n_vulnerability: true },
  });
};

export const getAllToDoItems = async () => {
  return prisma.to_do_item.findMany({ include: { n8n_vulnerability: true } });
};

export const updateToDoItem = async (id: number, vulnerabilityId: string) => {
  return prisma.to_do_item.update({
    where: { id },
    data: { vulnerabilityId },
  });
};

export const deleteToDoItem = async (id: number) => {
  return prisma.to_do_item.delete({
    where: { id },
  });
};

// --- IN_DEVELOPMENT_ITEM CRUD ---
export const createInDevelopmentItem = async (vulnerabilityId: string) => {
  return prisma.in_development_item.create({
    data: { vulnerabilityId },
  });
};

export const getInDevelopmentItem = async (id: number) => {
  return prisma.in_development_item.findUnique({
    where: { id },
    include: { n8n_vulnerability: true },
  });
};

export const getAllInDevelopmentItems = async () => {
  return prisma.in_development_item.findMany({ include: { n8n_vulnerability: true } });
};

export const updateInDevelopmentItem = async (id: number, vulnerabilityId: string) => {
  return prisma.in_development_item.update({
    where: { id },
    data: { vulnerabilityId },
  });
};

export const deleteInDevelopmentItem = async (id: number) => {
  return prisma.in_development_item.delete({
    where: { id },
  });
};

// --- READY_ITEM CRUD ---
export const createReadyItem = async (vulnerabilityId: string) => {
  return prisma.ready_item.create({
    data: { vulnerabilityId },
  });
};

export const getReadyItem = async (id: number) => {
  return prisma.ready_item.findUnique({
    where: { id },
    include: { n8n_vulnerability: true },
  });
};

export const getAllReadyItems = async () => {
  return prisma.ready_item.findMany({ include: { n8n_vulnerability: true } });
};

export const updateReadyItem = async (id: number, vulnerabilityId: string) => {
  return prisma.ready_item.update({
    where: { id },
    data: { vulnerabilityId },
  });
};

export const deleteReadyItem = async (id: number) => {
  return prisma.ready_item.delete({
    where: { id },
  });
};
