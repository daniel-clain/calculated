import { CSSProperties, ReactNode, useEffect, useState } from "react"

type Props = {
  children: ReactNode
  expanded?: boolean
  title?: string
  onExpanded?: () => void
}
export function ExpandCollapseContainer(props: Props) {
  const [expanded, setExpanded] = useState(props.expanded)
  useEffect(() => {
    setExpanded(props.expanded)
  }, [props.expanded])
  return (
    <div>
      <button
        onClick={() =>
          setExpanded((prev) => {
            const newExpanded = !prev
            if (newExpanded == true) props.onExpanded?.()
            return newExpanded
          })
        }
        style={{
          ...styles.pressableHeader,
          ...{
            backgroundColor: expanded ? "#9bcded" : "#9bcded",
          },
        }}
      >
        {props.title}
      </button>
      <div
        style={{
          overflow: "hidden",
          height: expanded ? "auto" : 0,
        }}
      >
        <div style={styles.mainContainer}>{props.children}</div>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  mainContainer: {
    padding: 10,
    borderWidth: 1,
    borderBlockColor: "black",
    alignItems: "flex-start",
  },
  pressableHeader: {
    padding: 10,
  },
}
