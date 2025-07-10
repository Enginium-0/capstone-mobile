// lib/utils/theme.js

import { COLORS, STYLES, FONT_SIZES } from "./enums";

export const FORMS = {
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#bbb',
    borderRadius: STYLES.BORDER_RADIUS,
    minHeight: STYLES.INPUT_HEIGHT,
    backgroundColor: 'white',
  },
  remove: {
    borderColor: 'red',
    padding: 10,
    height: STYLES.INPUT_HEIGHT,
    justifyContent: 'center',
  },
  submit: {
    height: STYLES.INPUT_HEIGHT,
  }, 
}

export const TAGS = {
  body: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  button: {
    padding: STYLES.BUTTON_PADDING,
    textAlign: 'center',
    borderRadius: STYLES.BORDER_RADIUS,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flexItem: {
    flexGrow: 1,
    flexShrink: 1,
  },
  form: {
    backgroundColor: 'white',
    padding: STYLES.PADDING,
    borderRadius: 12,
    gap: 16,
    flexGrow: 1,
    marginBottom: 20,
  },
  spacer: {
    height: STYLES.BODY_PADDING
  },
};

export const TEXTS = {
  button: {
    color: 'white',
  },
  label: {
    marginRight: 5,
    fontWeight: '500',
    fontSize: FONT_SIZES.large,
  },
  pageTitle: {
    fontSize: FONT_SIZES.title_one,
    fontWeight: '700',
    color: COLORS.primary,
  },
  placeholder: {
    color: COLORS.placeholder,
  },
  remove: {
    color: COLORS.red,
    textAlign: 'center',
  },
  small: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
  }
}

export function getColor({ byStatus = 0 } = {}) {
  switch (byStatus) {
    case 0: return COLORS.gray;      // pending
    case 1: return COLORS.orange;   // ongoing
    case 2: return COLORS.primary; // completed
    case 3: return COLORS.red;    // cancelled
    default: return COLORS.blue; // unknown
  }
}
