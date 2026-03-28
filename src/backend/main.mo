import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type MenuItem = {
    name : Text;
    description : Text;
    price : Text;
    category : Text;
    blobId : Text;
    available : Bool;
  };

  type Booking = {
    fullName : Text;
    phone : Text;
    email : Text;
    guests : Nat;
    date : Text;
    timeSlot : Text;
    status : Text;
    createdAt : Int;
  };

  type GalleryImage = {
    title : Text;
    category : Text;
    blobId : Text;
  };

  type DashboardStats = {
    totalBookings : Nat;
    pendingBookings : Nat;
    confirmedBookings : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Text.compare(booking1.date, booking2.date);
    };
  };

  let menuItems = Map.empty<Text, MenuItem>();
  let bookings = Map.empty<Text, Booking>();
  let galleryImages = Map.empty<Text, GalleryImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let timeSlots = [
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ];

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Items (Admin-only write)
  public shared ({ caller }) func addMenuItem(name : Text, description : Text, price : Text, category : Text, blobId : Text, available : Bool) : async MenuItem {
    requireAdmin(caller);
    let id = Text.fromArray(name.toArray().sliceToArray(0, 4));
    let item = {
      name;
      description;
      price;
      category;
      blobId;
      available;
    };
    menuItems.add(id, item);
    item;
  };

  public shared ({ caller }) func updateMenuItem(id : Text, name : Text, description : Text, price : Text, category : Text, blobId : Text, available : Bool) : async MenuItem {
    requireAdmin(caller);
    if (not menuItems.containsKey(id)) { Runtime.trap("Menu item not found") };
    let item = {
      name;
      description;
      price;
      category;
      blobId;
      available;
    };
    menuItems.add(id, item);
    item;
  };

  public shared ({ caller }) func deleteMenuItem(id : Text) : async () {
    requireAdmin(caller);
    if (not menuItems.containsKey(id)) { Runtime.trap("Menu item not found") };
    menuItems.remove(id);
  };

  public query func listMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  // Bookings
  public shared ({ caller }) func createBooking(fullName : Text, phone : Text, email : Text, guests : Nat, date : Text, timeSlot : Text) : async Booking {
    let id = Text.fromArray(fullName.toArray().sliceToArray(0, 4));
    let booking = {
      fullName;
      phone;
      email;
      guests;
      date;
      timeSlot;
      status = "pending";
      createdAt = Time.now();
    };
    bookings.add(id, booking);
    booking;
  };

  public shared ({ caller }) func updateBookingStatus(id : Text, status : Text) : async Booking {
    requireAdmin(caller);
    switch (bookings.get(id)) {
      case (?booking) {
        let updatedBooking = {
          booking with
          status;
        };
        bookings.add(id, updatedBooking);
        updatedBooking;
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    bookings.values().toArray().sort();
  };

  public query func getAvailableSlots(date : Text) : async [Text] {
    let bookedSlots = bookings.values().toArray().filter(
      func(b) {
        b.date == date
      }
    );
    let available = timeSlots.filter(
      func(slot) {
        let count = bookedSlots.filter(func(b) { b.timeSlot == slot }).size();
        count < 4;
      }
    );
    available;
  };

  // Gallery Images (Admin CRUD, public list)
  public shared ({ caller }) func addGalleryImage(title : Text, category : Text, blobId : Text) : async GalleryImage {
    requireAdmin(caller);
    let id = Text.fromArray(title.toArray().sliceToArray(0, 4));
    let image = {
      title;
      category;
      blobId;
    };
    galleryImages.add(id, image);
    image;
  };

  public shared ({ caller }) func updateGalleryImage(id : Text, title : Text, category : Text, blobId : Text) : async GalleryImage {
    requireAdmin(caller);
    if (not galleryImages.containsKey(id)) { Runtime.trap("Gallery image not found") };
    let image = {
      title;
      category;
      blobId;
    };
    galleryImages.add(id, image);
    image;
  };

  public shared ({ caller }) func deleteGalleryImage(id : Text) : async () {
    requireAdmin(caller);
    if (not galleryImages.containsKey(id)) { Runtime.trap("Gallery image not found") };
    galleryImages.remove(id);
  };

  public query func listGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

  // Dashboard Stats (Admin-only)
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let total = bookings.size();
    let pending = bookings.values().toArray().filter(func(b) { b.status == "pending" }).size();
    let confirmed = bookings.values().toArray().filter(func(b) { b.status == "confirmed" }).size();
    {
      totalBookings = total;
      pendingBookings = pending;
      confirmedBookings = confirmed;
    };
  };

  func requireAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };
};
