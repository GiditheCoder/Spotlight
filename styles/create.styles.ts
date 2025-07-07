// styles/create.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");
const { height} = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  contentDisabled: {
    opacity: 0.7,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  shareTextDisabled: {
    color: COLORS.grey,
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyImageText: {
    color: COLORS.grey,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageSection: {
    width: width,
    height: width,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  inputSection: {
    padding: 16,
    flex: 1,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingTop: 8,
    minHeight: 40,
  },

  // this is the story styles

   scrollContainer: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  yourStoryBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unviewedBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewedBorder: {
    width: 66,
    height: 66,    
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yourStoryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  addText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  username: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  // imported this
   postDetailContainer: {
      backgroundColor: COLORS.background,
      maxHeight: height * 0.9,
    },
    postDetailHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: COLORS.surface,
    },
    postDetailImage: {
      width: width,
      height: width,
    }, modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  }, 
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
  },
  progressBarBackground: {
  height: 4,
  backgroundColor: COLORS.grey,
  borderRadius: 2,
  overflow: 'hidden',
  marginBottom: 8,
},

progressBarFill: {
  height: '100%',
  backgroundColor: COLORS.primary,
  borderRadius: 2,
},

});