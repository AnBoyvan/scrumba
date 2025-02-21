/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as channels_handlers_create from "../channels/handlers/create.js";
import type * as channels_handlers_get from "../channels/handlers/get.js";
import type * as channels_handlers_getById from "../channels/handlers/getById.js";
import type * as channels_handlers_remove from "../channels/handlers/remove.js";
import type * as channels_handlers_update from "../channels/handlers/update.js";
import type * as channels from "../channels.js";
import type * as conversations_handlers_createOrGet from "../conversations/handlers/createOrGet.js";
import type * as conversations_handlers_getAll from "../conversations/handlers/getAll.js";
import type * as conversations_utils_onConversationRemove from "../conversations/utils/onConversationRemove.js";
import type * as conversations from "../conversations.js";
import type * as http from "../http.js";
import type * as members_handlers_current from "../members/handlers/current.js";
import type * as members_handlers_get from "../members/handlers/get.js";
import type * as members_handlers_getById from "../members/handlers/getById.js";
import type * as members_handlers_remove from "../members/handlers/remove.js";
import type * as members_handlers_update from "../members/handlers/update.js";
import type * as members_utils_getMember from "../members/utils/getMember.js";
import type * as members_utils_onMemberRemove from "../members/utils/onMemberRemove.js";
import type * as members_utils_populateMember from "../members/utils/populateMember.js";
import type * as members from "../members.js";
import type * as messages_handlers_create from "../messages/handlers/create.js";
import type * as messages_handlers_get from "../messages/handlers/get.js";
import type * as messages_handlers_getById from "../messages/handlers/getById.js";
import type * as messages_handlers_remove from "../messages/handlers/remove.js";
import type * as messages_handlers_update from "../messages/handlers/update.js";
import type * as messages_utils_getEntitiesByMessage from "../messages/utils/getEntitiesByMessage.js";
import type * as messages_utils_onMessageRemove from "../messages/utils/onMessageRemove.js";
import type * as messages_utils_populateThread from "../messages/utils/populateThread.js";
import type * as messages from "../messages.js";
import type * as reactions_handlers_toggle from "../reactions/handlers/toggle.js";
import type * as reactions_utils_populateReactions from "../reactions/utils/populateReactions.js";
import type * as reactions from "../reactions.js";
import type * as upload from "../upload.js";
import type * as users_handlers_current from "../users/handlers/current.js";
import type * as users_handlers_remove from "../users/handlers/remove.js";
import type * as users_handlers_update from "../users/handlers/update.js";
import type * as users_utils_populateUser from "../users/utils/populateUser.js";
import type * as users from "../users.js";
import type * as workspaces_handlers_create from "../workspaces/handlers/create.js";
import type * as workspaces_handlers_get from "../workspaces/handlers/get.js";
import type * as workspaces_handlers_getById from "../workspaces/handlers/getById.js";
import type * as workspaces_handlers_getInfoById from "../workspaces/handlers/getInfoById.js";
import type * as workspaces_handlers_getOnlyAdmin from "../workspaces/handlers/getOnlyAdmin.js";
import type * as workspaces_handlers_join from "../workspaces/handlers/join.js";
import type * as workspaces_handlers_newJoinCode from "../workspaces/handlers/newJoinCode.js";
import type * as workspaces_handlers_remove from "../workspaces/handlers/remove.js";
import type * as workspaces_handlers_update from "../workspaces/handlers/update.js";
import type * as workspaces_utils_generateCode from "../workspaces/utils/generateCode.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "channels/handlers/create": typeof channels_handlers_create;
  "channels/handlers/get": typeof channels_handlers_get;
  "channels/handlers/getById": typeof channels_handlers_getById;
  "channels/handlers/remove": typeof channels_handlers_remove;
  "channels/handlers/update": typeof channels_handlers_update;
  channels: typeof channels;
  "conversations/handlers/createOrGet": typeof conversations_handlers_createOrGet;
  "conversations/handlers/getAll": typeof conversations_handlers_getAll;
  "conversations/utils/onConversationRemove": typeof conversations_utils_onConversationRemove;
  conversations: typeof conversations;
  http: typeof http;
  "members/handlers/current": typeof members_handlers_current;
  "members/handlers/get": typeof members_handlers_get;
  "members/handlers/getById": typeof members_handlers_getById;
  "members/handlers/remove": typeof members_handlers_remove;
  "members/handlers/update": typeof members_handlers_update;
  "members/utils/getMember": typeof members_utils_getMember;
  "members/utils/onMemberRemove": typeof members_utils_onMemberRemove;
  "members/utils/populateMember": typeof members_utils_populateMember;
  members: typeof members;
  "messages/handlers/create": typeof messages_handlers_create;
  "messages/handlers/get": typeof messages_handlers_get;
  "messages/handlers/getById": typeof messages_handlers_getById;
  "messages/handlers/remove": typeof messages_handlers_remove;
  "messages/handlers/update": typeof messages_handlers_update;
  "messages/utils/getEntitiesByMessage": typeof messages_utils_getEntitiesByMessage;
  "messages/utils/onMessageRemove": typeof messages_utils_onMessageRemove;
  "messages/utils/populateThread": typeof messages_utils_populateThread;
  messages: typeof messages;
  "reactions/handlers/toggle": typeof reactions_handlers_toggle;
  "reactions/utils/populateReactions": typeof reactions_utils_populateReactions;
  reactions: typeof reactions;
  upload: typeof upload;
  "users/handlers/current": typeof users_handlers_current;
  "users/handlers/remove": typeof users_handlers_remove;
  "users/handlers/update": typeof users_handlers_update;
  "users/utils/populateUser": typeof users_utils_populateUser;
  users: typeof users;
  "workspaces/handlers/create": typeof workspaces_handlers_create;
  "workspaces/handlers/get": typeof workspaces_handlers_get;
  "workspaces/handlers/getById": typeof workspaces_handlers_getById;
  "workspaces/handlers/getInfoById": typeof workspaces_handlers_getInfoById;
  "workspaces/handlers/getOnlyAdmin": typeof workspaces_handlers_getOnlyAdmin;
  "workspaces/handlers/join": typeof workspaces_handlers_join;
  "workspaces/handlers/newJoinCode": typeof workspaces_handlers_newJoinCode;
  "workspaces/handlers/remove": typeof workspaces_handlers_remove;
  "workspaces/handlers/update": typeof workspaces_handlers_update;
  "workspaces/utils/generateCode": typeof workspaces_utils_generateCode;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
