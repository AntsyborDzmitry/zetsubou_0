package com.zetsubou_0.scala.test

import java.io.File
import java.nio.file._

/**
 * Created by Kiryl_Lutsyk on 10/28/2015.
 */
object FileTree {
    implicit def makeFileVisitor(f: (Path) => Unit) = new SimpleFileVisitor[Path] {
        override def visitFile(p: Path, attrs: attribute.BasicFileAttributes) = {
            f(p)
            FileVisitResult.CONTINUE
        }
    }

    def getTree(path: String): Unit = {
        Files.walkFileTree(new File(path).toPath, (f: Path) => println(f))
    }
}
