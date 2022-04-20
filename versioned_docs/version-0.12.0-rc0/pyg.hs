#!/usr/bin/env runhaskell

-- A Pandoc filter for using pygments syntax highlighting
-- loosely based on Matti Pastell's 2011 filters in https://bitbucket.org/mpastell/pandoc-filters/

import Text.Pandoc.JSON
import System.Process (readProcess)
import System.IO.Unsafe

main :: IO ()
main = toJSONFilter highlight

highlight :: Block -> Block
highlight c@(CodeBlock (_, [] , _ ) code) = c
highlight (CodeBlock (_, "isa":options , _ ) code) = RawBlock (Format "html") (pygments code ("isabelle":options))
highlight (CodeBlock (_, opts@(lang:options) , _ ) code) = RawBlock (Format "html") (pygments code opts)
highlight x = x

highlightIn :: Inline -> Inline
highlightIn (Code (_, ["isa"] , _ ) code) = RawInline (Format "html") ("<code>" ++ pygments_nowrap code ++ "</code>")
highlightIn x = x

std_opts :: [String]
std_opts = ["-f", "html", "-F", "symbols"]

line_nos :: [String]
line_nos = ["-O", "linenos=inline"]

lang :: String-> [String]
lang lg = ["-l", lg]

invoke_pygments :: [String] -> String -> String
invoke_pygments params code = unsafePerformIO $ readProcess "pygmentize" (std_opts ++ params) code

pygments_nowrap :: String -> String
pygments_nowrap code = head (lines (invoke_pygments (lang "isabelle" ++ ["-O", "nowrap"]) code))

pygments :: String -> [String] -> String
pygments code [lg]      = invoke_pygments (lang lg) code
pygments code [lg,nums] = invoke_pygments (lang lg ++ line_nos) code
pygments code _         = error "other pygments options not implemented"
