import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  DashboardStats,
  GalleryImage,
  MenuItem,
} from "../backend";
import { useActor } from "./useActor";

export function useListMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListGalleryImages() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryImage[]>({
    queryKey: ["galleryImages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableSlots(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["availableSlots", date],
    queryFn: async () => {
      if (!actor || !date) return [];
      return actor.getAvailableSlots(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitializeAsAdmin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("Not connected");
      return actor._initializeAccessControlWithSecret(secret);
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      phone: string;
      email: string;
      guests: number;
      date: string;
      timeSlot: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        data.fullName,
        data.phone,
        data.email,
        BigInt(data.guests),
        data.date,
        data.timeSlot,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: string;
      category: string;
      blobId: string;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMenuItem(
        data.name,
        data.description,
        data.price,
        data.category,
        data.blobId,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: string;
      category: string;
      blobId: string;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMenuItem(
        data.id,
        data.name,
        data.description,
        data.price,
        data.category,
        data.blobId,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      category: string;
      blobId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGalleryImage(data.title, data.category, data.blobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryImages"] });
    },
  });
}
