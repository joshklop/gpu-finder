import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './Filter.css'

interface FilterProps {
  filter: string,
  setFilter: Function,
}

export default function GlobalFilter({ filter, setFilter }: FilterProps) {
    const placeholder = <FontAwesomeIcon icon={faMagnifyingGlass}/>
    return (
      <span>
        <input placeholder='Search' value={filter || ''} onChange={e => setFilter(e.target.value)}/>
      </span>
    )
  }
